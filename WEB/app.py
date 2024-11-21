from flask import Flask, request, render_template, jsonify
from pyspark.sql import SparkSession
from pyspark.ml.recommendation import ALSModel
from pyspark.sql.functions import col
from pyspark.sql.functions import explode

app = Flask(__name__)

# Khởi tạo SparkContext
spark = SparkSession.builder \
    .appName("MovieRecommendationSystem") \
    .config("spark.driver.memory", "8g") \
    .config("spark.shuffle.spill.numElementsForceSpillThreshold", 50000) \
    .config("spark.memory.offHeap.enabled", "true") \
    .config("spark.memory.offHeap.size", "1g") \
    .config("spark.executorEnv.OPENBLAS_NUM_THREADS", "1") \
    .getOrCreate()

# Load mô hình ALS từ HDFS
model_path = "hdfs://localhost:9000/Models/modelASL"
als_model = ALSModel.load(model_path)
# Đọc dữ liệu từ tệp CSV và tạo DataFrame trong Spark
movies_df = spark.read.csv("D:/datamovies/4_2015/movies.csv", header=True, inferSchema=True)

# Đổi tên cột 'movieId' thành 'movie_id' để phù hợp với cột trong ALS recommendations
movies_df = movies_df.withColumnRenamed("movieId", "movie_id")

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/recommend', methods=['POST'])
def recommend():
    try:
        # Nhận dữ liệu đầu vào từ biểu mẫu
        user_id = int(request.form['user_id'])

        # Thực hiện dự đoán bằng mô hình ALS
        recommendations = als_model.recommendForUserSubset(spark.createDataFrame([(user_id,)], ['userId']), 10)

        # Chuyển đổi cấu trúc cột recommendations để tách thành hai cột: movieId và rating
        recommendations = recommendations.withColumn("recommendation", explode(col("recommendations"))) \
            .select("userId", col("recommendation.movieId").alias("movie_id"), col("recommendation.rating").alias("rating"))

        # Thực hiện phép join và lấy thông tin về tiêu đề và thể loại của các bộ phim được đề xuất
        joined_df = recommendations.join(movies_df, "movie_id") \
            .select("userId", "movie_id", "title", "genres")

        # Lấy thông tin về movie_id, title và thể loại của các bộ phim được đề xuất từ DataFrame đã join
        movie_info = []
        for row in joined_df.collect():
            movie_id = row['movie_id']
            title = row['title']
            genres = row['genres']
            movie_info.append({'movie_id': movie_id, 'title': title, 'genres': genres})

        # Hiển thị user_id và thông tin về các bộ phim được đề xuất
        return render_template('recommendations.html', user_id=user_id, movie_info=movie_info)
    except Exception as e:
        return jsonify({'error': str(e)})



if __name__ == '__main__':
    app.run(debug=True, port=5001)
