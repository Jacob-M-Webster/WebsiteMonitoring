import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import {createClient} from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseAPI = process.env.SUPABASE_ANON_KEY!
const app = new Hono()
const supabase = createClient(supabaseUrl, supabaseAPI)

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/test', async (c) => {
  const { data, error } = await supabase
    .from('users')
    .select()
  
  console.log(data, error)
  return c.json({ data, error })
})

app.post('/monitors', async (c) => {
    // Hard Code the User ID until auth is set up.
    const {url, user_id, check_interval} = await c.req.json()
    const {data, error} = await supabase
      .from('monitors')
      .insert({
        url: url,
        user_id: 1, // Hard Code to make it obvious to change later !!!!CHANGE ME!!!!
        check_interval: check_interval,
    })
      .select()


    if (error) return c.json({error: error.message }, 400)
    return c.json(data)
})

// TODO 
// GET /montiors
app.get("/monitors", async(c) => {
    const {data, error} = await supabase
      .from('monitors')
      .select("*")
      .eq('user_id', 1) // HARD CODED USER ID FOR TESTING
    
    if (error) return c.json({error: error.message }, 400)
    return c.json(data)
})

// GET /monitors/:id
app.get("/monitors/:id", async(c) => {
    const id = c.req.param('id')
    const {data, error} = await supabase
      .from('monitors')
      .select("*")
      .eq('user_id', 1) // HARD CODED USER ID FOR TESTING
      .eq('monitor_id', id)
    
    if (error) return c.json({error: error.message }, 400)
    return c.json(data)
})

// PUT /monitors/:id
app.put("/monitors/:id", async(c) => {
    const id = c.req.param('id')
    const {url, check_interval} = await c.req.json()
    const {data, error} = await supabase
      .from('monitors')
      .update({
        url: url,
        check_interval: check_interval
      })
      .eq("user_id", 1) // HARD CODED USER ID FOR TESTING
      .eq('monitor_id', id)
      .select()

    if (error) return c.json({error: error.message }, 400)
    return c.json(data)
})

// DELETE /monitors/:id
app.delete("/monitors/:id", async(c) => {
    const id = c.req.param("id")
    const {data, error} = await supabase
      .from("monitors")
      .delete()
      .eq("user_id", 1) // HARD CODED USER ID FOR TESTING
      .eq("monitor_id", id)
    
    if (error) return c.json({error: error.message }, 400)
    return c.json(data)
})


serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
