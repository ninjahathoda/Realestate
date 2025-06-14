import sys
print("Python executable being used:", sys.executable)
import time
import random
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from pymongo import MongoClient

# --------- CONFIGURATION ---------
USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36"
]

def get_city_url(city):
    # Converts "New Delhi" -> "new-delhi"
    city_url = city.strip().lower().replace(" ", "-")
    return f"https://www.magicbricks.com/property-for-sale-in-{city_url}-pppfs"

def configure_options():
    options = Options()
    # Comment out headless for debugging (uncomment in production)
    # options.add_argument("--headless=new")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument("--disable-extensions")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-webgl")
    options.add_argument("--mute-audio")
    options.add_argument(f"user-agent={random.choice(USER_AGENTS)}")
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option("useAutomationExtension", False)
    return options

def get_database_connection():
    client = MongoClient("mongodb://localhost:27017", serverSelectionTimeoutMS=5000)
    return client["real_estate"]["magicbricks_properties"]

if __name__ == "__main__":
    # --------- GET CITY & URL ---------
    city = sys.argv[1] if len(sys.argv) > 1 else "new delhi"
    url = get_city_url(city)
    print(f"Using URL: {url}")

    # --------- SETUP SELENIUM ---------
    driver = webdriver.Chrome(
        service=Service(ChromeDriverManager().install()),
        options=configure_options()
    )
    driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")

    # --------- SETUP DATABASE ---------
    collection = get_database_connection()
    collection.delete_many({})  # Clear old data

    # --------- SCRAPING ---------
    try:
        driver.get(url)
        print("Navigated to:", driver.current_url)
        time.sleep(random.uniform(3, 6))  # Wait for page to load

        # Save page for debugging
        with open("debug_page.html", "w", encoding="utf-8") as f:
            f.write(driver.page_source)

        # Wait for at least one listing card to appear
        try:
            WebDriverWait(driver, 25).until(
                EC.visibility_of_element_located((By.CSS_SELECTOR, ".mb-srp__card"))
            )
        except TimeoutException:
            print("❌ No listings found. Check debug_page.html for details.")
            driver.quit()
            sys.exit()

        cards = driver.find_elements(By.CSS_SELECTOR, ".mb-srp__card")
        print(f"✅ Found {len(cards)} listings on the first page.")

        # --------- EXTRACT LISTINGS ---------
        for card in cards[:10]:  # Limit to first 10 for demo
            try:
                title = card.find_element(By.CSS_SELECTOR, ".mb-srp__card--title").text.strip()
            except Exception:
                title = "N/A"

            try:
                price = card.find_element(By.CSS_SELECTOR, ".mb-srp__card__price--amount").text.strip().replace("\n", " ")
            except Exception:
                price = "N/A"

            try:
                location = card.find_element(By.CSS_SELECTOR, ".mb-srp__card__location").text.strip()
            except Exception:
                location = city.title()

            data = {
                "title": title,
                "price": price,
                "location": location
            }
            print(data)
            try:
                collection.insert_one(data)
            except Exception as e:
                print(f"⚠️ MongoDB insert error: {e}")

            time.sleep(random.uniform(1, 3))  # Slow down to avoid detection

    except Exception as e:
        print(f"🚨 Critical error: {e}")
        driver.save_screenshot("error_screenshot.png")
    finally:
        driver.quit()
        print("🎉 Scraping completed.")

