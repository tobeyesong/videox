# Use an offical Node runtime as a parent image
FROM node:18

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY package*.json ./
   
# Install any needed packages specified in requirements.txt
RUN apt-get update && apt-get install -y ffmpeg

# Install dependencies
RUN npm install

# Copy app source inside the docker image
COPY . .

# Make port 3000 available to the world outside this container
EXPOSE 3000

#Define command to run your app using CMD which defines your runtime
CMD [ "npm", "start" ]

