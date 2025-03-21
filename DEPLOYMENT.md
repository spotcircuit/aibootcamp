# Deploying to Vercel with PostgreSQL

This guide will walk you through the process of deploying your AI Bootcamp application to Vercel with PostgreSQL database integration.

## Prerequisites

1. A Vercel account (you can sign up at [vercel.com](https://vercel.com))
2. A GitHub, GitLab, or Bitbucket repository containing your project
3. Node.js 18.x or later installed on your local machine

## Step 1: Push Your Code to a Repository

Make sure your code is committed and pushed to a Git repository.

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push
```

## Step 2: Create a Vercel Postgres Database

1. Log in to your Vercel account and navigate to the dashboard
2. Click on "Storage" in the sidebar
3. Select "Create Database" and choose "Postgres"
4. Follow the prompts to create your database
5. Once created, Vercel will provide you with connection credentials

## Step 3: Set Up Your Project on Vercel

1. From the Vercel dashboard, click "Add New Project"
2. Import your Git repository
3. Configure your project settings:
   - Framework Preset: Next.js
   - Root Directory: Leave as default (if your project is at the root)
   - Build Command: `npm run build`
   - Output Directory: `.next`

## Step 4: Configure Environment Variables

Add the following environment variables to your Vercel project:

- `DATABASE_URL`: Use the connection string provided by Vercel Postgres
- `NEXTAUTH_URL`: Your production URL (e.g., https://your-app.vercel.app)
- `NEXTAUTH_SECRET`: A secure random string for NextAuth.js
- `NODE_ENV`: Set to `production`

## Step 5: Deploy Your Application

1. Click "Deploy" to start the deployment process
2. Vercel will build and deploy your application

## Step 6: Run Database Migrations

After deployment, you need to run your database migrations:

1. Install the Vercel CLI if you haven't already:
   ```bash
   npm i -g vercel
   ```

2. Link your local project to the Vercel project:
   ```bash
   vercel link
   ```

3. Pull the environment variables to your local machine:
   ```bash
   vercel env pull
   ```

4. Run your migration script:
   ```bash
   vercel --prod
   ```

5. Alternatively, you can run SQL commands directly through the Vercel dashboard:
   - Go to the "Storage" section
   - Select your Postgres database
   - Click on the "Query" tab
   - Paste the contents of your `schema.sql` file and run it

## Troubleshooting

- **Database Connection Issues**: Ensure your `DATABASE_URL` environment variable is correctly set
- **Build Failures**: Check your build logs in the Vercel dashboard
- **Runtime Errors**: Check the Function Logs in the Vercel dashboard
- **Local vs Production Discrepancies**: Ensure your code handles both development and production environments

## Updating Your Deployment

Any changes pushed to your Git repository's main branch will trigger a new deployment on Vercel automatically.

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Postgres Documentation](https://vercel.com/docs/storage/vercel-postgres)
- [Next.js Documentation](https://nextjs.org/docs)
