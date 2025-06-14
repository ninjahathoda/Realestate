from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from pymongo import MongoClient
import sys
import time

# -------- Get city from argument --------
city = sys.argv[1] if len(sys.argv) > 1 else "noida"
url = f"https://www.magicbricks.com/property-for-sale/residential-real-estate?cityName={city}"

# -------- Chrome options --------
options = Options()
# options.add_argument("--headless=new")  # Uncomment for production
options.add_argument("--disable-blink-features=AutomationControlled")
options.add_experimental_option("excludeSwitches", ["enable-automation"])
options.add_experimental_option("useAutomationExtension", False)
options.add_argument("start-maximized")
options.add_argument("incognito")
options.add_argument("disable-infobars")
options.add_argument(
    "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36"
)

# -------- Launch Chrome --------
driver = webdriver.Chrome(
    service=Service(ChromeDriverManager().install()),
    options=options
)
driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")

# -------- Navigate --------
driver.get(url)

# -------- Wait for listings --------
try:
    WebDriverWait(driver, 20).until(
        EC.presence_of_all_elements_located((By.CSS_SELECTOR, ".mb-srp__list > div"))
    )
except TimeoutException as e:
    print("❌ Timeout waiting for listings:", e)
    driver.save_screenshot("debug_timeout.png")
    driver.quit()
    sys.exit()

cards = driver.find_elements(By.CSS_SELECTOR, ".mb-srp__list > div")
print(f"✅ Found {len(cards)} listings")

# -------- MongoDB --------
client = MongoClient("mongodb://localhost:27017")
db = client["real_estate"]
collection = db["magicbricks_properties"]
collection.delete_many({})  # clear old

# -------- Extract listings --------
for card in cards[:10]:
    try:
        title = card.find_element(By.CSS_SELECTOR, ".mb-srp__card--title").text.strip()
    except:
        title = "N/A"

    try:
        price = card.find_element(By.CSS_SELECTOR, ".mb-srp__card__price--amount").text.strip().replace("\n", " ")
    except:
        price = "N/A"

    try:
        location_elem = card.find_elements(By.CSS_SELECTOR, ".mb-srp__card__location")
        if location_elem and location_elem[0].text.strip():
            location = location_elem[0].text.strip()
        elif " in " in title:
            location = title.split(" in ")[-1].strip()
        else:
            location = "N/A"
    except:
        location = "N/A"

    # Skip if all fields are N/A
    if title == "N/A" and price == "N/A" and location == "N/A":
        continue

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

    time.sleep(1)  # Optional: delay to reduce bot detection

driver.quit()
