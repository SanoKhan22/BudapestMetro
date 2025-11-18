#!/bin/bash
# Budapest Metro Game - Start Script

echo "🚇 Starting Budapest Metro Game..."
echo "📂 Server running at: http://localhost:8001"
echo "🌐 Open your browser and go to: http://localhost:8001"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python3 -m http.server 8001
