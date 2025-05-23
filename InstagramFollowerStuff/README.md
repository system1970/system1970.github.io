# Instagram Follower Utilities

This directory contains tools and scripts related to Instagram profiles, primarily focusing on generating a word cloud from a list of followers.

## Main Feature: Word Cloud Generator

Located in the `WordCloud/` subdirectory, this tool generates a word cloud image from a text file listing Instagram followers.

### `WordCloud/` Directory Contents:

*   `main.py`: The main Python script to generate the word cloud.
*   `scrapper.py`: A Python script likely used for scraping Instagram follower data using Selenium (suggested by the presence of `chromedriver`). **Note: Web scraping Instagram is against their Terms of Service and can lead to account restrictions.**
*   `followers.txt`: A sample (or placeholder) text file where the list of followers should be provided, one username per line.
*   `Image Masks/`: A directory containing images that can be used as masks to shape the word cloud.
*   `Output Images/`: The directory where generated word cloud images will be saved.
*   `Truculenta_18pt_Condensed-Bold.ttf`, `a_new_hope.png`: Font and image resources, likely for styling the word cloud.

### How to Use the Word Cloud Generator (General Steps)

1.  **Prerequisites:**
    *   Python 3.x
    *   Python libraries: `wordcloud`, `matplotlib`, `Pillow` (PIL). You may need to install these (e.g., `pip install wordcloud matplotlib Pillow`).
    *   If using `scrapper.py`: Selenium and a compatible ChromeDriver. (See notes on `chromedriver-win64` below).
2.  **Prepare Follower List:**
    *   Manually create or update `WordCloud/followers.txt` with the list of Instagram usernames, one per line.
    *   Alternatively, if you intend to use `scrapper.py` (and understand the risks), you might need to configure it with your Instagram credentials and run it to populate `followers.txt`. **Use `scrapper.py` with extreme caution and at your own risk.**
3.  **Run the Generator:**
    *   Navigate to the `WordCloud/` directory.
    *   Execute `python main.py`.
    *   The generated word cloud image will be saved in the `WordCloud/Output Images/` directory.
    *   You might be able to customize the font, mask, and other parameters by modifying `main.py`.

## `chromedriver-win64/` Directory

This directory contains `chromedriver.exe` for Windows (64-bit), which is required by Selenium to control the Chrome browser for web scraping tasks (like those potentially performed by `scrapper.py`).

**Important Notes:**

*   **Instagram's Terms of Service:** Scraping Instagram data is against their Terms of Service. Using automated scripts to access Instagram can result in your IP address being blocked or your account being temporarily or permanently suspended. Use any scraping scripts with full awareness of these risks.
*   **Ethical Considerations:** Be mindful of privacy and ethical considerations when collecting or using data from social media platforms.
*   **Dependencies:** Ensure you have all necessary Python packages installed before running the scripts.

This `README.md` provides a general overview. A more detailed `README.md` might be present or could be added to the `WordCloud/` subdirectory for more specific instructions on that tool.
