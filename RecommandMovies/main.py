# import requests
# from bs4 import BeautifulSoup
#
# # Gửi yêu cầu GET đến trang web
# response = requests.get('https://www.imdb.com/search/title/?groups=top_100&start=51&ref_=adv_nxt')
#
# # Kiểm tra xem yêu cầu đã thành công không
# if response.status_code == 200:
#     # Sử dụng BeautifulSoup để phân tích cú pháp HTML của trang web
#     soup = BeautifulSoup(response.content, 'html.parser')
#
#     # Tạo hoặc mở một tệp văn bản để ghi thông tin
#     with open('phim_top_100_imdb.txt', 'w', encoding='utf-8') as file:
#         # Tìm tất cả các phần tử có class là 'lister-item mode-advanced'
#         movies = soup.find_all('div', class_='lister-item mode-advanced')
#
#         # Lặp qua từng phim và trích xuất thông tin cần thiết
#         for movie in movies:
#             # Trích xuất tiêu đề phim
#             title = movie.h3.a.text.strip() if movie.h3.a else "N/A"
#
#             # Trích xuất năm sản xuất
#             year = movie.h3.find('span', class_='lister-item-year').text.strip() if movie.h3.find('span',
#                                                                                                   class_='lister-item-year') else "N/A"
#
#             # Trích xuất thể loại phim
#             genre = movie.p.find('span', class_='genre').text.strip() if movie.p.find('span', class_='genre') else "N/A"
#
#             # Trích xuất điểm đánh giá từ IMDb
#             rating = movie.find('div', class_='ratings-imdb-rating').strong.text.strip() if movie.find('div',
#                                                                                                        class_='ratings-imdb-rating') else "N/A"
#
#             # Trích xuất thông tin thời lượng từ thẻ <span class="runtime">
#             runtime_span = movie.p.find('span', class_='runtime')
#             runtime = runtime_span.text.strip() if runtime_span else "N/A"
#
#             # Trích xuất giá trị "Votes"
#             votes_tag = movie.find('span', string='Votes:')
#             votes = votes_tag.find_next('span', {'name': 'nv', 'data-value': True}).text.strip() if votes_tag else "N/A"
#
#             # Trích xuất giá trị "Gross"
#             gross_tag = movie.find('span', string='Gross:')
#             gross = gross_tag.find_next('span', {'name': 'nv', 'data-value': True}).text.strip() if gross_tag else "N/A"
#
#             # Viết thông tin của phim vào tệp văn bản
#             file.write(f'Tiêu đề: {title}\n')
#             file.write(f'Năm sản xuất: {year}\n')
#             file.write(f'Thể loại: {genre}\n')
#             file.write(f'Điểm đánh giá: {rating}\n')
#             file.write(f'Thời lượng: {runtime}\n')
#             file.write(f'Votes: {votes}\n')
#             file.write(f'Gross: {gross}\n')
#             file.write('---\n')
#
#     print('Thông tin các phim đã được lưu vào tệp phim_top_100_imdb.txt.')
# else:
#     print('Không thể kết nối đến trang web.')

# import csv
#
# # Đọc dữ liệu từ tệp phim_top_100_imdb.txt và lưu vào danh sách movies
# with open('C:/Users/ADMIN/phim_top_100_imdb.txt', 'r', encoding='utf-8') as file:
#     lines = file.readlines()
##Chuẩn bị danh sách movies và biến current_movie:
# movies = []
# current_movie = {}
#
# for line in lines:
#     if ':' in line:
#         key, value = line.strip().split(': ', 1)  # Chỉ chia thành 2 phần, key và value
#         if key == "Năm sản xuất":
#             # Xử lý trường hợp "(2000)" và chỉ giữ lại số năm
#             value = value.strip('()')
#         current_movie[key] = value
#     elif line.strip() == '---':
#         if current_movie:
#             movies.append(current_movie)
#             current_movie = {}
#
# # Ghi dữ liệu vào tệp phim top 100 imdb.csv dưới dạng CSV
# with open('phim_top_100_imdb.csv', 'w', newline='', encoding='utf-8') as csvfile:
#     csv_writer = csv.writer(csv
#     file)
#
#     # Viết tiêu đề cho các cột trong tệp tin CSV
#     csv
#     writer.writerow(['Tiêu đề', 'Năm sản xuất', 'Thể loại', 'Điểm đánh giá', 'Thời lượng', 'Votes', 'Gross'])
#
#     # Ghi dữ liệu từ danh sách movies vào tệp tin CSV
#     for movie in movies:
#         csv
#         writer.writerow([movie.get("Tiêu đề"), movie.getz("Năm sản xuất"), movie.get("Thể loại"),
#                          movie.get("Điểm đánh giá"), movie.get("Thời lượng"), movie.get("Votes"),
#                          movie.get("Gross")])
#
# print("Dữ liệu đã được ghi vào tệp phim top 100 imdb.csv.")

# from pyspark.sql import SparkSession
# from pyspark.sql.functions import unix_timestamp
# from pyspark.sql.types import TimestampType
# from pyspark.sql.types import StringType
# spark = SparkSession.builder.appName("MergeAndConvert").getOrCreate()
#
#
# # Đọc dữ liệu từ tệp ratings.csv
# ratings_data = spark.read.csv("D:/datamovies/4_2015/ratings.csv", header=True, inferSchema=True)
#
#
# # Đọc dữ liệu từ tệp movies.csv
# movies_data = spark.read.csv("D:/datamovies/4_2015/movies.csv", header=True, inferSchema=True)
#
#
# # Đọc dữ liệu từ tệp tags.csv
# tags_data = spark.read.csv("D:/datamovies/4_2015/tags.csv", header=True, inferSchema=True)
# tags_data = tags_data.withColumn("timestamp", tags_data["timestamp"].cast(StringType()))
#
#
# # Chuyển đổi cột timestamp trong tags_data thành định dạng thời gian đọc được
# tags_data = tags_data.withColumn("timestamp", unix_timestamp("timestamp").cast(TimestampType()))
#
#
# # Gộp dữ liệu từ ratings_data và movies_data dựa trên cột 'movieId'
# merged_data = ratings_data.join(movies_data, on='movieId', how='inner')
#
#
# # Cấu hình Spark để hiển thị đầy đủ nội dung của cột 'title'
# spark.conf.set("spark.sql.repl.eagerEval.enabled", True)
# spark.conf.set("spark.sql.repl.eagerEval.maxNumRows", 20)
#
#
# from pyspark.sql.types import TimestampType
#
#
# # Chuyển đổi cột "timestamp" thành loại dữ liệu thời gian
# merged_data = merged_data.withColumn("timestamp", merged_data["timestamp"].cast(TimestampType()))
# merged_data.show(50, truncate=False)
# #lưu vào ổ cứng\
# merged_data.write.csv("D:/datamovies/4_2015/merged_data_csv")








from pyspark.sql import SparkSession
from pyspark.sql.connect.functions import lit
from pyspark.sql.types import StructType, StructField, IntegerType, DoubleType, StringType, TimestampType
from pyspark.ml.recommendation import ALS
from pyspark.ml.evaluation import RegressionEvaluator
# Khởi tạo SparkSession
spark = SparkSession.builder \
    .appName("MovieRecommendationSystem") \
    .config("spark.driver.memory", "8g") \
    .config("spark.shuffle.spill.numElementsForceSpillThreshold", 50000) \
    .config("spark.memory.offHeap.enabled", "true") \
    .config("spark.memory.offHeap.size", "1g") \
    .config("spark.executorEnv.OPENBLAS_NUM_THREADS", "1") \
    .getOrCreate()





# Định nghĩa schema cho dữ liệu
schema = StructType([
    StructField("movieId", IntegerType(), True),
    StructField("userId", IntegerType(), True),
    StructField("rating", DoubleType(), True),
    StructField("timestamp", TimestampType(), True),
    StructField("title", StringType(), True),
    StructField("genres", StringType(), True)
])

# Đọc dữ liệu với schema đã định nghĩa
csv_data = spark.read.csv("D:/datamovies/merged_data.csv/part-00000-d9263bbf-9b3e-4130-b609-813cf4b5bdde-c000.csv", header=False, schema=schema)



# Hiển thị dữ liệu
csv_data.show()
from pyspark.sql.functions import countDistinct, max, min

# Tính tổng số người dùng
total_users = csv_data.select(countDistinct("userId")).first()[0]

# Tính tổng số bộ phim
total_movies = csv_data.select(countDistinct("movieId")).first()[0]

# Tính rating cao nhất
max_rating = csv_data.select(max("rating")).first()[0]

# Tính rating thấp nhất
min_rating = csv_data.select(min("rating")).first()[0]

print(f"Tổng số người dùng: {total_users}")
print(f"Tổng số bộ phim: {total_movies}")
print(f"Rating cao nhất: {max_rating}")
print(f"Rating thấp nhất: {min_rating}")

#biểu đồ cho dữ liệu rating
import matplotlib.pyplot as plt

# Tính tỷ lệ rating trung bình cho mỗi bộ phim
average_ratings = csv_data.groupBy("movieId").agg({"rating": "mean"}).withColumnRenamed("avg(rating)", "average_rating")

# Chuyển đổi dữ liệu thành Pandas DataFrame để vẽ biểu đồ
pd_ratings = average_ratings.toPandas()

# Vẽ biểu đồ
plt.figure(figsize=(12, 6))
plt.hist(pd_ratings["average_rating"], bins=30, edgecolor='black')
plt.xlabel('Điểm Trung Bình')
plt.ylabel('Số Lượng Phim')
plt.title('Phân Phối Điểm Trung Bình Của Các Phim')
plt.show()



# Chia dữ liệu thành tập huấn luyện và tập kiểm tra (80-20)
(training_data, test_data) = csv_data.randomSplit([0.8, 0.2], seed=1234)

# Xây dựng mô hình ALS sử dụng tập huấn luyện
als = ALS(maxIter=15, regParam=0.1, rank=15, userCol="userId", itemCol="movieId", ratingCol="rating", coldStartStrategy="drop", nonnegative=True)
model = als.fit(training_data)

# Đánh giá mô hình trên tập kiểm tra bằng RMSE
predictions = model.transform(test_data)
evaluator = RegressionEvaluator(metricName="rmse", labelCol="rating", predictionCol="prediction")
rmse = evaluator.evaluate(predictions)
print("Root Mean Squared Error (RMSE) on test data = " + str(rmse))

# Hiển thị các dự đoán trên tập kiểm tra
#predictions.show(truncate=False)
# from pyspark.ml.tuning import ParamGridBuilder, CrossValidator
#
# # Xây dựng grid search cho các siêu tham số cần tinh chỉnh
# paramGrid = ParamGridBuilder() \
#     .addGrid(als.maxIter, [5, 10, 15]) \
#     .addGrid(als.regParam, [0.01, 0.1, 1.0]) \
#     .addGrid(als.rank, [5, 10, 15]) \
#     .build()
#
# # Khởi tạo CrossValidator với ALS model, các tham số grid, và metric để đánh giá mô hình (RMSE)
# crossval = CrossValidator(estimator=als,
#                           estimatorParamMaps=paramGrid,
#                           evaluator=evaluator,
#                           numFolds=3)  # Số lần chia tập dữ liệu (fold) trong Cross-Validation
#
# # Huấn luyện mô hình với Cross-Validator và dữ liệu huấn luyện
# cvModel = crossval.fit(training_data)
#
# # Lấy mô hình tốt nhất từ Cross-Validator
# best_model = cvModel.bestModel
#
# # In ra các siêu tham số tốt nhất được tìm thấy
# print("Best MaxIter: ", best_model._java_obj.parent().getMaxIter())
# print("Best RegParam: ", best_model._java_obj.parent().getRegParam())
# print("Best Rank: ", best_model._java_obj.parent().getRank())
#
# # Đánh giá chất lượng dự đoán trên tập kiểm tra bằng RMSE
# predictions = best_model.transform(test_data)
# rmse = evaluator.evaluate(predictions)
# print("Root Mean Squared Error (RMSE) on test data = " + str(rmse))

# Best MaxIter:  15
# Best RegParam:  0.1
# Best Rank:  15
# Root Mean Squared Error (RMSE) on test data = 0.8109716344310653
from pyspark.sql.functions import explode
from pyspark.sql.functions import col
# Tạo danh sách 10 đề xuất phim hàng đầu cho mỗi người dùng
userRecs = model.recommendForAllUsers(10)
# Loại bỏ các bộ phim trùng lặp cho mỗi người dùng và gán tên mới cho cột
uniqueUserRecs = userRecs.withColumn("unique_recommendations", col("recommendations").getItem(0))

# Lấy 10 phim có đề xuất cao nhất cho tất cả các ID người dùng
uniqueUserRecs.show(truncate=False)
new_user_id = int(input("Nhập userId: "))
# Hiển thị 10 đề xuất phim hàng đầu cho một người dùng cụ thể
user1_recommendations = uniqueUserRecs.filter(col("userId") == new_user_id).select("recommendations")
# Sử dụng hàm explode để chuyển mảng cột recommendations thành các dòng riêng lẻ
user1_recommendations_exploded = user1_recommendations.withColumn("exploded_recommendations", explode("recommendations"))
movies_data = spark.read.csv("D:/datamovies/4_2015/movies.csv", header=True)
# Gộp DataFrame user1_recommendations_exploded và csv_data dựa trên cột movieId
recommendations_with_titles = user1_recommendations_exploded.alias("ur").join(
    movies_data.alias("cd"),
    user1_recommendations_exploded.exploded_recommendations.movieId == movies_data.movieId,
    "left_outer"
).select("ur.exploded_recommendations.movieId", "ur.exploded_recommendations.rating", "cd.title", "cd.genres")

# Hiển thị kết quả
recommendations_with_titles.show(truncate=False)



from pyspark.sql.functions import col, lit


from pyspark.sql import Row
new_user_id = int(input("Nhập userId mới: "))
new_movies_id = int(input("Nhập moviesId: "))
while True:
    try:
        new_rating = float(input("Nhập đánh giá cho bộ phim (từ 1 đến 5): "))
        if 1 <= new_rating <= 5:
            break  # Nếu giá trị hợp lệ, thoát khỏi vòng lặp
        else:
            print("Đánh giá phải nằm trong khoảng từ 1 đến 5. Vui lòng nhập lại.")
    except ValueError:
        print("Vui lòng nhập một số hợp lệ.")


# Kiểm tra xem new_user_id có tồn tại trong danh sách userId hiện tại không
if new_user_id not in csv_data.select("userId").rdd.flatMap(lambda x: x).collect():
    # Tạo DataFrame cho đánh giá của người dùng mới và thêm vào csv_data
    new_user_data = spark.createDataFrame([(new_movies_id, new_user_id, new_rating, None, None, None)], schema=schema)
    csv_data = csv_data.union(new_user_data)
# Huấn luyện mô hình ALS với dữ liệu mới
model = als.fit(csv_data)

# Lấy ra các đề xuất cho người dùng mới
user_recommendations = model.recommendForUserSubset(spark.createDataFrame([(new_user_id,)], ["userId"]), 10)
# Lấy dữ liệu đề xuất thành danh sách Python
recommendations_list = user_recommendations.collect()
# Sử dụng hàm explode để chuyển mảng recommendations thành các dòng đơn lẻ
user_recommendations_exploded = user_recommendations.withColumn("exploded_recommendations", explode("recommendations"))

# Gộp DataFrame user_recommendations_exploded và csv_data dựa trên cột movieId
recommendations_with_titles = user_recommendations_exploded.alias("ur").join(
    movies_data.alias("cd"),
    user_recommendations_exploded.exploded_recommendations.movieId == movies_data.movieId,
    "left_outer"
).select("ur.userId", "ur.exploded_recommendations.movieId", "ur.exploded_recommendations.rating", "cd.title", "cd.genres")
# Lọc các hàng có movieId
selected_movie_info = movies_data.filter(movies_data.movieId == new_movies_id).select("title", "genres")
selected_movie_info.show(truncate=False)
# Hiển thị kết quả dưới dạng DataFrame
recommendations_with_titles.show(truncate=False)








