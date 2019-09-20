FROM openjdk:8-jre-slim
RUN apt-get update
RUN apt-get install build-essential zlib1g-dev libncurses5-dev libgdbm-dev libnss3-dev libssl-dev libreadline-dev libffi-dev wget curl -y
RUN curl -O https://www.python.org/ftp/python/3.7.3/Python-3.7.3.tar.xz
RUN tar -xf Python-3.7.3.tar.xz
WORKDIR /Python-3.7.3
RUN ./configure --enable-optimizations
RUN make altinstall
ENV PYTHONUNBUFFERED 1
WORKDIR /usr/src/app
COPY microservices_python ./
RUN apt-get install -y python3.7-dev
RUN apt install -y python3-pip
RUN pip3 install --no-cache-dir -r requirements.txt
CMD ["python3", "-u", "init.py", "prod"]