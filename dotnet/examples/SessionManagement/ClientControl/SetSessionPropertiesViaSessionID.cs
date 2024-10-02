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
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using static System.Console;
using NUnit.Framework;
using PushTechnology.ClientInterface.Client.Factories;
using static PushTechnology.ClientInterface.Examples.Program;


namespace PushTechnology.ClientInterface.Examples.SessionManagement.ClientControl
{
    public sealed class SetSessionPropertiesViaSessionID : Example
    {
        public override async Task Run(CancellationToken cancellationToken, string[] args)
        {
            string serverUrl = args[0];

            var session = Diffusion.Sessions
                .Principal("admin")
                .Credentials(Diffusion.Credentials.Password("password"))
                .Open(serverUrl);

            var session2 = Diffusion.Sessions
                .Principal("client")
                .Credentials(Diffusion.Credentials.Password("password"))
                .Open(serverUrl);

            var properties = new Dictionary<string, string> { { "$Language", "French" } };
            var changedProperties = await session.ClientControl.SetSessionPropertiesAsync(session2.SessionId, properties, cancellationToken);

            foreach (var changedProperty in changedProperties)
            {
                string value = string.IsNullOrEmpty(changedProperty.Value) ? "[not set]" : $"'{changedProperty.Value}'";
                WriteLine($"Session property {changedProperty.Key} changed from {value} to '{properties[changedProperty.Key]}'");
            }

            await Task.Delay(5000);

            session2.Close();
            session.Close();
        }
    }
}
