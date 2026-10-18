### Building and running your application

When you're ready, start your application by running:
`docker compose up --build`.

Your application will be available at http://localhost:4000.

### Configuring the backend URL

The frontend backend URLs are public `NEXT_PUBLIC_` variables, so Next.js embeds
them into the browser bundle during the Docker image build. Set them before
building (for example, in a root `.env` file used by Docker Compose):

```env
NEXT_PUBLIC_BACKEND_URL=https://api.example.com
NEXT_PUBLIC_API_URL=https://api.example.com/api
NEXT_PUBLIC_APP_URL=https://shop.example.com
```

`docker compose up --build` passes these values to the build. If omitted,
Compose defaults to localhost for local development. Direct Docker builds
require all three values to be supplied. Changing a value requires rebuilding
the image.

For a direct Docker build, pass the same variables as build arguments:

```bash
docker build \
  --build-arg NEXT_PUBLIC_BACKEND_URL=https://api.example.com \
  --build-arg NEXT_PUBLIC_API_URL=https://api.example.com/api \
  --build-arg NEXT_PUBLIC_APP_URL=https://shop.example.com \
  -t myapp .
```

### Deploying your application to the cloud

First, build your image, e.g.: `docker build -t myapp .`.
If your cloud uses a different CPU architecture than your development
machine (e.g., you are on a Mac M1 and your cloud provider is amd64),
you'll want to build the image for that platform, e.g.:
`docker build --platform=linux/amd64 -t myapp .`.

Then, push it to your registry, e.g. `docker push myregistry.com/myapp`.

Consult Docker's [getting started](https://docs.docker.com/go/get-started-sharing/)
docs for more detail on building and pushing.

### References
* [Docker's Node.js guide](https://docs.docker.com/language/nodejs/)