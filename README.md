Include a .env for Prisma and a .env.local for NextJS

`DATABASE_URL=postgresql://username:password@192.168.254.254:5000/db_name`

Run `sudo docker run -p 5000:5432 -d -e POSTGRES_PASSWORD=password -e POSTGRES_USER=username -e POSTGRES_DB=db_name -v variable_name:/var/lib/postgresql/data postgres:alpine`

The port `5000`, `password`, `username`, `db_name`, and `variable_name` are all arbitrary and can be set to whatever you want.
