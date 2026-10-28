/**
 * Copyright © 2023 - 2026 Diffusion Data Ltd.
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
using PushTechnology.ClientInterface.Client.Session;
using PushTechnology.ClientInterface.Client.Session.Reconnection;
using static System.Console;
using static PushTechnology.ClientInterface.Examples.Program;

namespace PushTechnology.ClientInterface.Examples.Connection.Resilience
{
    public sealed class ReconnectionStrategy : Example
    {
#pragma warning disable CS1998
        public override async Task Run(CancellationToken cancellationToken, string[] args)
        {
            string serverUrl = args[0];

            var session = Diffusion.Sessions
                .Principal("admin")
                .Credentials(Diffusion.Credentials.Password("password"))
                .ReconnectionPolicy(CreateReconnectionPolicy())
                .Open(serverUrl);

            WriteLine($"Connected. Session Identifier: {session.SessionId}.");

            // Insert work here...

            session.Close();
#pragma warning restore CS1998
        }

        /// <summary>
        /// Creates the policy used to reconnect to the server when the session is disconnected unexpectedly.
        /// </summary>
        private static IReconnectionPolicy CreateReconnectionPolicy()
        {
            // Make up to 10 reconnection attempts, 3 seconds apart, for up to
            // 10 minutes. The attempts restart for each new disconnection.
            var retryPolicy = Diffusion.NewRetryPolicyBuilder()
                .Interval(TimeSpan.FromSeconds(3))
                .Attempts(10)
                .Build();

            return Diffusion.NewReconnectionPolicyBuilder()
                .RetryPolicy(retryPolicy)
                .Timeout(TimeSpan.FromMinutes(10))
                .Build();
        }
    }
}
