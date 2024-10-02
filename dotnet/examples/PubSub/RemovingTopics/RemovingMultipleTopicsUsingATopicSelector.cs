/**
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
using PushTechnology.ClientInterface.Client.Factories;
using PushTechnology.ClientInterface.Client.Features.Control.Topics;
using PushTechnology.ClientInterface.Client.Session;
using PushTechnology.ClientInterface.Client.Topics;
using PushTechnology.ClientInterface.Client.Topics.Details;
using static System.Console;
using static PushTechnology.ClientInterface.Examples.Program;

namespace PushTechnology.ClientInterface.Examples.PubSub.RemovingTopics
{
     public sealed class RemovingMultipleTopicsUsingATopicSelector : Example
     {
        public override async Task Run(CancellationToken cancellationToken, string[] args)
        {
            string serverUrl = args[0];

            var session = Diffusion.Sessions
                .Principal("admin")
                .Credentials(Diffusion.Credentials.Password("password"))
                .Open(serverUrl);

            var topicSpecification = session.TopicControl.NewSpecification(TopicType.JSON);

            await AddTopic(session, "this/topic1", topicSpecification, cancellationToken);
            await AddTopic(session, "this/topic2", topicSpecification, cancellationToken);
            await AddTopic(session, "my/topic/path/to/be/removed", topicSpecification, cancellationToken);
            await AddTopic(session, "my/topic/path/to/be/also/removed", topicSpecification, cancellationToken);

            var result = await session.TopicControl.RemoveTopicsAsync("?my/topic/path/to/be//", cancellationToken);

            WriteLine($"{result.RemovedCount} topics have been removed.");

            await Task.Delay(5000);

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
    }
}
