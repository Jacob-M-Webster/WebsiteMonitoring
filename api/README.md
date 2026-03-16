This is going to be a bit of a long read me since I want to get better at documenting my learning process
and the steps I took to create this project.

"Phase 1"
I started with working with claude to determine the overall architecture of the project.
We broke it down into 5 main parts
1. The Backend: Deployed on Railway or Render, built with Node, Supplies data
2. The Database: postgres supabase
3. The Queue: Upstash Redis
4. Cloudflare Workers: Easy Horizontal Scaling, Pings URLS and reports status updates
5. Frontend: Vercel + React

I then had to determine the data that was going to be stored in the DB
This is the format I went with

table users {
    user_id 
    // Going to implement auth through supabase for sign ins so I didnt store anything else yet
}

table monitors {
    url
    monitor_id
    user_id
    check_interval
    is_active
    current_status // I chose to have current status be updated as the checks occur so that the denormalized data is quicker to recall

}

table checks {
    monitor_id
    checks_id
    timestamp
    current_status
}

I then created the Hono app and created REST endpoints for accessing the monitor data with a hard coded
user_id of 1. This will be fixed once I implement sign ins and auth.

I ran into a little bit of trouble with RLS during testing since I don't have an auth system currently so I had to turn
it off for the monitors and checks table for the time being