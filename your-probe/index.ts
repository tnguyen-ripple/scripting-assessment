import fetch from "node-fetch"
import { MeterProvider, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { GetLastBlock, NodeBody } from "./src/client";


console.log("testing testing");

const collectorOptions = {
    headers: {}, // an optional object containing custom headers to be sent with each request
    concurrencyLimit: 1, // an optional limit on pending requests
};
const metricExporter = new OTLPMetricExporter(collectorOptions);
const meterProvider = new MeterProvider({});

meterProvider.addMetricReader(new PeriodicExportingMetricReader({
    exporter: metricExporter,
    exportIntervalMillis: 1000,
}));

const meter = meterProvider.getMeter('eth-public-node');
const counter = meter.createCounter('latest_block_number', {
    description: 'Latest hexa block number of ETH Node',
  });


const start = async () => {
    while(true) {
        const lastBlockNumber = await GetLastBlock();
        counter.add(lastBlockNumber);
        console.log(lastBlockNumber);

        // wait for 5 seconds before pulling new number
        await new Promise(resolve => setTimeout(resolve, 5000)); 
    }
};

start();