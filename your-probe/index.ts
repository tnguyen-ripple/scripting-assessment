import fetch from "node-fetch"
import { MeterProvider, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { GetLastBlock, NodeBody } from "./src/client";

console.log("Starting exporter...")
const collectorOptions = {
   // metrics endpoint default to be http://localhost:4318/v1/metrics
   // if using Prometheus with OTLP enabled, use http://localhost:9090/api/v1/otlp/v1/metrics
   // this option can be override using environment variable OTEL_EXPORTER_OTLP_METRICS_ENDPOINT
    concurrencyLimit: 1, // an optional limit on pending requests
  };
const metricExporter = new OTLPMetricExporter(collectorOptions);
const meterProvider = new MeterProvider({});

meterProvider.addMetricReader(new PeriodicExportingMetricReader({
    exporter: metricExporter,
    exportIntervalMillis: 10000, // export every 10 seconds
}));

console.log("Metrics are sending to" , metricExporter._otlpExporter.url)

// Now, start recording data
const meter = meterProvider.getMeter('eth-public-node');
const attributes = { pid: process.pid, environment: 'test' };

// Use Synchronous Gague for non-additive metric
// https://opentelemetry.io/docs/specs/otel/metrics/supplementary-guidelines/#guidelines-for-instrumentation-library-authors
// https://opentelemetry.io/docs/specs/otel/metrics/api/#gauge
const gauge = meter.createGauge("last_eth_block_number", {
    description: 'Last HEXA block number of ETH node',
});

const start = async () => {
    while (true) {
        const lastBlock = await GetLastBlock();
        gauge.record(lastBlock, attributes);
        // wait for 5 seconds before pulling new number
        await new Promise(resolve => setTimeout(resolve, 5000)); 
    }
};
start();