dotnet tool install -g dotnet-ef
dotnet ef dbcontext scaffold "Host=ep-soft-cake-agnlxtk8-pooler.c-2.eu-central-1.aws.neon.tech; Database=neondb; Username=neondb_owner; Password=npg_l7O1QGgecryN; SSL Mode=VerifyFull; Channel Binding=Require;" Npgsql.EntityFrameworkCore.PostgreSQL \
    --output-dir ./Entities \
    --context-dir . \
    --context MyDbContext \
    --no-onconfiguring \
    --namespace efscaffold.Entities \
    --context-namespace Infrastructure.Postgres.Scaffolding \
    --schema library \
    --force