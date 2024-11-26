/*******************************************************************************
 * Copyright (C) 2024 Diffusion Data Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *******************************************************************************/

const diffusion = require('diffusion');

export async function metricsListTopicMetricCollectors() {
    // Connect to the server.
    const session = await diffusion.connect({
        host: 'localhost',
        port: 8080,
        principal: 'admin',
        credentials: 'password'
    });

    const topicMetricCollector1 = diffusion.newTopicMetricCollectorBuilder()
        .exportToPrometheus(false)
        .maximumGroups(10)
        .groupByTopicType(true)
        .groupByTopicView(true)
        .groupByPathPrefixParts(15)
        .create('Topic Metric Collector 1', '?my/topic//');
    const topicMetricCollector2 = diffusion.newTopicMetricCollectorBuilder()
        .exportToPrometheus(false)
        .maximumGroups(10)
        .groupByTopicType(true)
        .groupByTopicView(true)
        .groupByPathPrefixParts(15)
        .create('Topic Metric Collector 2', '?my/topic//');
    await Promise.all([
        session.metrics.putTopicMetricCollector(topicMetricCollector1),
        session.metrics.putTopicMetricCollector(topicMetricCollector2)
    ]);

    const topicMetricCollectors = await session.metrics.listTopicMetricCollectors();
    for (const collector of topicMetricCollectors.collectors) {
        console.log(`${collector.name}: ${collector.topicSelector} (${collector.maximumGroups}, ` +
            `${collector.exportToPrometheus}, ${collector.groupByTopicType}, ${collector.groupByTopicView}, ${collector.groupByPathPrefixParts})`);
    }

    await session.closeSession();
}
