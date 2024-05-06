from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
import pyautogui
import time
    
driver = webdriver.Chrome()

driver.get("https://www.instagram.com/accounts/login/")

time.sleep(2)

# Accept cookies
# try:
#     cookies_button = WebDriverWait(driver, 1000).until(
#         EC.element_to_be_clickable((By.XPATH, "//button[text()='Allow all cookies']"))
#     )
#     cookies_button.click()
# except:
    # pass

username_input = driver.find_element(By.CSS_SELECTOR, "input[name='username']")
password_input = driver.find_element(By.CSS_SELECTOR, "input[name='password']")
username_input.send_keys("")
password_input.send_keys("")
password_input.send_keys(Keys.ENTER)

# Wait for login
time.sleep(5)

driver.get("https://www.instagram.com/pracurser/followers/")

time.sleep(3)
# pyautogui.click()
pyautogui.hotkey('ctrl', 'shift', 'i')
# ActionChains(driver).key_down(Keys.CONTROL).key_down(Keys.SHIFT).send_keys('i').key_up(Keys.SHIFT).key_up(Keys.CONTROL).perform()
time.sleep(2)  
pyautogui.hotkey('ctrl', 'shift', 'm')
time.sleep(2) 

driver.get("https://www.instagram.com/pracurser/followers/")

# Move the cursor to the correct spot on the screen
ActionChains(driver).move_by_offset(100, 100).perform()

scroll_duration = 45
start_time = time.time()
while time.time() - start_time < scroll_duration:
    driver.execute_script("window.scrollBy(0, 100);")
    time.sleep(0.1)

# Get the HTML content of the followers list
followers_html = driver.page_source

soup = BeautifulSoup(followers_html, "html.parser")

follower_names = soup.find_all("span", class_="_ap3a _aaco _aacw _aacx _aad7 _aade")

print(len(follower_names))
follower_names_list = [follower.text for follower in follower_names]

for name in follower_names_list:
    print(name)

concatenated_names = '\n'.join(follower_names_list)

filename_write = 'followers.txt'
with open(filename_write, 'w') as file:
    file.write(concatenated_names)

driver.quit()
