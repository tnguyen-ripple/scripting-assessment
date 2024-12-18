# Part 1
How to test: 
```
# Build probe docker image
cd your-probe
docker build -t your-probe:v1.0 .
# Start the stack
docker compose up
# Start the probe
# As I use Prometheus as OLTP receiver
docker run -d \
--env NODE_ENV=dev \
--env OTEL_EXPORTER_OTLP_METRICS_ENDPOINT='http://localhost:9090/api/v1/otlp/v1/metrics' \
--network=host \
your-probe:v1.0

# Find the metrics in prometheus at
# http://localhost:9090/graph?g0.expr=max(last_eth_block_number)&g0.tab=0&g0.stacked=0&g0.show_exemplars=1&g0.range_input=5m
```

# Part 2
The dashboard is saved at [grafana-dashboard.json](grafana-dashboard.json)