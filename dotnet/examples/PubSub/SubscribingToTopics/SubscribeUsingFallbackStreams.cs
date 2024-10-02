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
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using static System.Console;
using PushTechnology.ClientInterface.Client.Factories;
using PushTechnology.ClientInterface.Client.Topics.Details;
using PushTechnology.ClientInterface.Client.Topics;
using static PushTechnology.ClientInterface.Examples.Program;
using PushTechnology.ClientInterface.Client.Features;
using PushTechnology.ClientInterface.Data.JSON;
using PushTechnology.ClientInterface.Client.Callbacks;
using PushTechnology.ClientInterface.Client.Features.Topics;
using PushTechnology.ClientInterface.Client.Features.Control.Topics;
using PushTechnology.ClientInterface.Client.Session;

namespace PushTechnology.ClientInterface.Examples.PubSub.SubscribingToTopics
{
     public sealed class SubscribeUsingFallbackStreams : Example
     {
        public override async Task Run(CancellationToken cancellationToken, string[] args)
        {
            string serverUrl = args[0];

            var session = Diffusion.Sessions
                .Principal("admin")
                .Credentials(Diffusion.Credentials.Password("password"))
                .Open(serverUrl);

            var topicSpecification = session.TopicControl.NewSpecification(TopicType.JSON);

            await AddTopic(session, "my/topic/path", topicSpecification, cancellationToken);
            await AddTopic(session, "my/other/topic/path", topicSpecification, cancellationToken);

            var fallbackStream = new FallbackStream();
            session.Topics.AddFallbackStream(fallbackStream);

            string topicSelector = "?my//";

            await session.Topics.SubscribeAsync(topicSelector, cancellationToken);

            await Task.Delay(5000);

            WriteLine("Creating my/additional/topic/path");

            await AddTopic(session, "my/additional/topic/path", topicSpecification, cancellationToken);

            await Task.Delay(5000);

            WriteLine("Creating this/topic/path/will/not/be/picked/up");

            await AddTopic(session, "this/topic/path/will/not/be/picked/up", topicSpecification, cancellationToken);

            await Task.Delay(5000);

            await session.Topics.UnsubscribeAsync(topicSelector, cancellationToken);
            session.Topics.RemoveStream(fallbackStream);

            session.Close();
        }

        private async Task AddTopic(ISession session, string topic, ITopicSpecification topicSpecification, CancellationToken cancellationToken)
        {
            var result = await session.TopicControl.AddTopicAsync(topic, topicSpecification, cancellationToken);

            if (result == AddTopicResult.CREATED)
            {
                WriteLine("Topic has been created.");
            }
            else
            {
                WriteLine("Topic already exists.");
            }
        }

        private sealed class FallbackStream : IValueStream<IJSON>
        {

            public void OnClose() {}

            public void OnError(ErrorReason errorReason) {}

            public void OnSubscription(string topicPath, ITopicSpecification specification)
            {
                WriteLine($"Subscribed to {topicPath}.");
            }

            public void OnUnsubscription(string topicPath, ITopicSpecification specification, TopicUnsubscribeReason reason)
            {
                WriteLine($"Unsubscribed from {topicPath}: {reason}.");
            }

            public void OnValue(string topicPath, ITopicSpecification specification, IJSON oldValue, IJSON newValue)
            {
                WriteLine($"{topicPath} changed from {(oldValue == null ? "NULL" : oldValue.ToJSONString())} to {newValue.ToJSONString()}.");
            }
        }
    }
}
