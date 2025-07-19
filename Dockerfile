FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY study_planner /app

RUN ./mvnw clean package -DskipTests

CMD ["java", "-jar", "target/study_planner-0.0.1-SNAPSHOT.jar"]
