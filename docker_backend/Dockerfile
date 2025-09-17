# syntax=docker/dockerfile:1

#base image
FROM python:3.12

#set working directory
WORKDIR /app

#copy directory contents into the container at /app
COPY . /app
COPY start.sh /start.sh

#install required os packages
RUN apt-get update && apt-get install -y curl build-essential && rm -rf /var/lib/apt/lists/*

#upgrade pip
RUN pip install --upgrade pip

#install python dependencies
RUN pip install -r requirements.txt

# ⬇️ IMPORTANT: fix CRLF and make executable
RUN sed -i 's/\r$//' /start.sh && chmod +x /start.sh

#expose port 8000
EXPOSE 8000

#run the application
CMD ["/start.sh"]