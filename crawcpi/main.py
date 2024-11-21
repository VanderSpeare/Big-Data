import requests
import csv
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.common.by import By
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}
chrome_service = ChromeService(executable_path='D:/chrome/chromedriver-win64/chromedriver.exe')
driver = webdriver.Chrome(service=chrome_service)
url = "https://finance.vietstock.vn/du-lieu-vi-mo/52/cpi.htm"
driver.get(url)
page_source = driver.page_source
soup = BeautifulSoup(page_source, "html.parser")
tables = soup.find_all("table", attrs={"id": "tbl-macro-data"})
# print(tables)
# for table in tables:
#     thead = table.find("thead")
#
#     if thead:
#         header_cells = thead.find_all("th")
#         for header_cell in header_cells:
#             print(header_cell.text.strip())
#
#     tbody = table.find("tbody")
#     if tbody:
#         tbody_cells = tbody.find_all("td")
#         for tbody_cell in tbody_cells:
#             print(tbody_cell.text.strip())

# Mở file CSV để ghi dữ liệu vào
# with open("output.csv", "w", newline="", encoding="utf-8") as csvfile:
#     # Tạo đối tượng CSV writer
#     csvwriter = csv.writer(csvfile)
#
#     # Lặp qua danh sách các bảng đã tìm thấy
#     for table in tables:
#         thead = table.find("thead")
#         tbody = table.find("tbody")
#
#         # Kiểm tra xem có phần đầu và phần thân của bảng hay không
#         if thead and tbody:
#             # Trích xuất tiêu đề từ các thẻ <th> trong phần đầu của bảng và ghi vào file CSV
#             header_cells = thead.find_all("th")
#             header_row = [header_cell.text.strip() for header_cell in header_cells]
#             csvwriter.writerow(header_row)
#
#             # Trích xuất dữ liệu từ các ô (thẻ <td>) trong phần thân của bảng và ghi vào file CSV
#             rows = tbody.find_all("tr")
#             for row in rows:
#                 cells = row.find_all("td")
#                 row_data = [cell.text.strip() for cell in cells]
#                 csvwriter.writerow(row_data)

