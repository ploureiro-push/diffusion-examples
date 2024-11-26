﻿/**
 * Copyright © 2023 - 2024 Diffusion Data Ltd.
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
 */

using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using PushTechnology.ClientInterface.Client.Factories;
using PushTechnology.ClientInterface.Client.Features.Control.Topics;
using PushTechnology.ClientInterface.Client.Topics;
using PushTechnology.ClientInterface.Client.Topics.Details;
using static System.Console;
using static PushTechnology.ClientInterface.Examples.Program;


namespace PushTechnology.ClientInterface.Examples.TimeSeries
{
    public sealed class AppendToTimeSeriesTopicWithUserSuppliedTimestamp : Example 
    {
        public override async Task Run( CancellationToken cancellationToken, string[] args ) 
        {
            string serverUrl = args[0];

            var session = Diffusion.Sessions
                .Principal("admin")
                .Credentials(Diffusion.Credentials.Password("password"))
                .Open(serverUrl);

            string typeName = Diffusion.DataTypes.Get<double?>().TypeName;

            var topicProperties = new Dictionary<string, string> {
                        { TopicSpecificationProperty.TimeSeriesEventValueType, typeName },
                        { TopicSpecificationProperty.TimeSeriesRetainedRange, "limit 15 last 10s" },
                        { TopicSpecificationProperty.TimeSeriesSubscriptionRange, "limit 3" }
                    };

            var specification = session.TopicControl.NewSpecification(TopicType.TIME_SERIES)
                .WithProperties(topicProperties);

            string topic = "my/time/series/topic/path/user/supplied";

            var result = await session.TopicControl.AddTopicAsync(topic, specification, cancellationToken);

            if (result == AddTopicResult.CREATED)
            {
                WriteLine("Topic has been created.");
            }
            else
            {
                WriteLine("Topic already exists.");
            }

            int millis = 1000000;
            var random = new Random();

            for (int i = 0; i < 25; i++)
            {
                double newValue = random.NextDouble();

                await session.TimeSeries.AppendAsync<double?>(topic, newValue, DateTimeOffset.FromUnixTimeMilliseconds(++millis), cancellationToken);
            }

            session.Close();
        }
    }
}
