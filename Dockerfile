#############
### build ###
#############

# base image
FROM node:22-alpine AS build

# set working directory
WORKDIR /app

# add /app/node_modules/.bin to $PATH
ENV PATH=/app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json yarn.lock* /app/
RUN yarn install --network-timeout=300000 --frozen-lockfile

# Install additional type definitions that might be missing
RUN yarn add --dev @types/minimatch || true

# add app
COPY . /app

# Set Node options for build (includes OpenSSL legacy provider for compatibility)
ENV NODE_OPTIONS="--max_old_space_size=4096 --openssl-legacy-provider"

# Set TypeScript to skip lib check and be more lenient
ENV TSC_COMPILE_ON_ERROR=true
ENV GENERATE_SOURCEMAP=false

# generate build
RUN yarn build

############
### prod ###
############

# base image
FROM nginx:1.16.0-alpine
## Copy our default nginx config
COPY nginx/default.conf /etc/nginx/conf.d/

# copy artifact build from the 'build environment'
COPY --from=build /app/build /usr/share/nginx/html

# expose port 80
EXPOSE 80

# run nginx
CMD ["nginx", "-g", "daemon off;"]
