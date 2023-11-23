

# 基础镜像
FROM node:18.18.0-alpine3.18
# 创建一个应用目录
WORKDIR /usr/src/app
#按照PM2
RUN npm install -g pm2
# 这个星号通配符意思是复制package.json和package-lock.json,复制到当前应用目录
COPY package*.json ./
# 安装应用依赖
RUN npm install --legacy-peer-deps
# 安装完毕后复制当前目录所有文件到镜像目录里面
COPY . . 
# 执行npm run build 后生成dist目录
RUN npm run build
# 使用打包后的镜像
CMD ["node","dist/main.js"]

EXPOSE 3000