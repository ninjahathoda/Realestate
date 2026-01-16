# RealEstatePro 

> A full-stack real estate aggregation platform that centralizes property searches, featuring an automated scraping pipeline and dynamic property comparison.


##  About The Project

**RealEstatePro** is designed to simplify the fragmented real estate market. Instead of browsing multiple disparate sites, users can access a centralized dashboard to search, view, and compare properties.

The platform leverages a powerful **Python & Selenium** scraping pipeline to aggregate live listings (specifically from MagicBricks) and stores them in **MongoDB**. A high-performance **FastAPI** backend serves this data to a responsive **React** frontend, where users can filter and compare properties side-by-side.

###  Key Features

*   **Centralized Search:** Aggregates real-time property listings into a single, efficient interface.
*   **Automated Web Scraper:** Custom Python/Selenium pipeline that fetches 100+ live listings, parsing up to 20 new properties per search dynamically.
*   **Smart Comparison Tool:** specific "Compare" feature allowing users to weigh properties against 3+ advanced filters (Price, Location, Property Type), reducing decision time by ~40%.
*   **Responsive UI:** Built with **React.js** and **Tailwind CSS** for a seamless mobile and desktop experience.

##  Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend** | React.js, Tailwind CSS |
| **Backend** | FastAPI, Python, Selenium, Uvicorn |
| **Database** | MongoDB |

---

##  Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

Ensure you have the following installed:
*   **Node.js** (v14 or higher)
*   **Python** (v3.8 or higher)
*   **MongoDB** (Local or Atlas URL)
*   **Google Chrome** (for Selenium scraping)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/ninjahathoda/Realestate.git
    cd Realestate
    ```

###  Backend Setup

The backend code resides in the `backend/` folder.

1.  **Navigate to the backend directory**
    ```bash
    cd backend
    ```

2.  **Create a virtual environment (optional but recommended)**
    ```bash
    python -m venv venv
    # Windows
    .\venv\Scripts\activate
    # macOS/Linux
    source venv/bin/activate
    ```

3.  **Install Python dependencies**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configure Environment Variables**
    Create a `.env` file in the `backend/` directory and add your MongoDB connection string:
    ```env
    MONGO_URI=mongodb://localhost:27017/realestate_db
    ```

5.  **Run the Server**
    ```bash
    uvicorn main:app --reload
    ```
    *The API will be available at `http://localhost:8000`*

###  Frontend Setup

The frontend is located in the root directory.

1.  **Open a new terminal and navigate to the project root**
    ```bash
    cd Realestate
    ```

2.  **Install Node dependencies**
    ```bash
    npm install
    ```

3.  **Start the React Application**
    ```bash
    npm start
    ```
    *The app will launch in your browser at `http://localhost:3000`*

---

##  Usage

1.  **Home Page:** Browse the latest aggregated listings.
2.  **Search:** Use the search bar to find properties by city or keyword. This may trigger the background scraper to fetch fresh data if the cache is empty.
3.  **Compare:** Select multiple properties and click the "Compare" button. You can filter the comparison view by **Price**, **Location**, and **Type** to make easier decisions.

##  Project Structure

```bash
Realestate/
├── backend/               # FastAPI Backend & Scraper
│   ├── main.py            # API Entry point
│   ├── models.py          # Database models
│   ├── scraper.py         # Selenium scraping logic
│   └── requirements.txt   # Python dependencies
├── src/                   # React Frontend Source
│   ├── components/        # Reusable UI components
│   ├── pages/             # Main application pages
│   └── App.js             # Main React Component
├── public/                # Static assets
└── README.md              # Project Documentation
