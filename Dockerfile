FROM node as webapp
WORKDIR /data/app

ARG PORT=3000
ENV $PORT PORT

COPY ./package.json /data
RUN npm install && npm cache clean --force 

COPY . /data/app

ENV PATH /data/node_modules/.bin:$PATH

EXPOSE 3000
RUN npm run build

FROM nginx
COPY --from=build-stage /data/app/build /var/www/webapp/
COPY --from=build-stage /data/app/ex.conf /etc/nginx/conf.d/default.conf

