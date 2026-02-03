import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// Simple .env parser
const loadEnv = () => {
    const envFiles = ['.env', '.env.local'];
    let loaded = false;

    envFiles.forEach(file => {
        const filePath = path.resolve(process.cwd(), file);
        if (fs.existsSync(filePath)) {
            console.log(`Loading env from ${file}...`);
            const content = fs.readFileSync(filePath, 'utf-8');
            content.split('\n').forEach(line => {
                // Matches "KEY=value", "  KEY = value ", "export KEY='value'"
                const match = line.match(/^\s*(?:export\s+)?([\w\.\-]+)\s*=\s*(.*)?$/);
                if (match) {
                    const key = match[1];
                    let value = match[2] || '';
                    // Remove quotes
                    value = value.trim().replace(/^["']|["']$/g, '');
                    // Only set if not already set (preserve system envs)
                    if (!process.env[key]) {
                        process.env[key] = value;
                    }
                }
            });
            loaded = true;
        }
    });

    if (!loaded) console.log("No .env files found.");
}

loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
    console.error("❌ MISSING CREDENTIALS in environment!");
    console.log("Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.");
    // Print what we found for debugging (masking values)
    Object.keys(process.env).forEach(k => {
        if (k.includes('SUPABASE')) {
            console.log(`Found env: ${k} = ${process.env[k] ? '***' : '(empty)'}`);
        }
    });
    process.exit(1);
}

console.log(`URL: ${url}`);
console.log(`Key: ${key.substring(0, 10)}... (length: ${key.length})`);

if (!url.startsWith('http')) {
    console.error("❌ URL does not start with http/https");
}

const supabase = createClient(url, key);

async function check() {
    console.log("Testing connection...");
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: 'test_connection_check@example.com',
            password: 'wrong_password_intentionally'
        });

        if (error) {
            if (error.message && (error.message.toLowerCase().includes('invalid api key') || error.message.toLowerCase().includes('jwks'))) {
                console.error("❌ FAILURE: Invalid API Key. The key provided is rejected by Supabase.");
            } else {
                console.log("✅ SUCCESS: API Key seems valid.");
                console.log(`(Received expected auth error: "${error.message}")`);
            }
        } else {
            console.log("✅ SUCCESS: Connection worked.");
        }
    } catch (e) {
        console.error("❌ EXCEPTION during request:", e);
    }
}

check();
