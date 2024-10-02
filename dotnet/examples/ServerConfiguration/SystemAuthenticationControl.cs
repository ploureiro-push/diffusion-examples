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
using System.Threading;
using System.Threading.Tasks;
using PushTechnology.ClientInterface.Client.Factories;
using static System.Console;
using static PushTechnology.ClientInterface.Examples.Program;

namespace PushTechnology.ClientInterface.Examples.ServerConfiguration
{
    public sealed class SystemAuthenticationControl : Example
    {
        public override async Task Run(CancellationToken cancellationToken, string[] args)
        {
            string serverUrl = args[0];

            var session = Diffusion.Sessions.Principal("admin").Password("password")
                .Open(serverUrl);

            var storeScript = await session.SystemAuthenticationControl.GetSystemAuthenticationAsync(cancellationToken);

            WriteLine($"{storeScript}");

            await Task.Delay(5000);

            WriteLine($"Creating a new principal.");

            string updateScript = session.SystemAuthenticationControl.Script
                .DenyAnonymousConnections()
                .AddPrincipal("observer", "12345", new List<string>() { "CLIENT_CONTROL", "TOPIC_CONTROL", "AUTHENTICATION_HANDLER" })
                .ToScript();

            await session.SystemAuthenticationControl.UpdateStoreAsync(updateScript, cancellationToken);

            storeScript = await session.SystemAuthenticationControl.GetSystemAuthenticationAsync(cancellationToken);

            WriteLine($"{storeScript}");

            await Task.Delay(5000);

            WriteLine($"Adding ADMINISTRATOR roles to observer principal.");

            updateScript = session.SystemAuthenticationControl.Script
                .AssignRoles("observer", new[] { "ADMINISTRATOR" })
                .TrustClientProposedPropertyIn("laptop", new List<string> { "macbook", "dell", "lenovo" })
                .IgnoreClientProposedProperty("calculator")
                .ToScript();

            await session.SystemAuthenticationControl.UpdateStoreAsync(updateScript, cancellationToken);

            storeScript = await session.SystemAuthenticationControl.GetSystemAuthenticationAsync(cancellationToken);

            WriteLine($"{storeScript}");

            await Task.Delay(5000);

            WriteLine($"Removing observer principal.");

            updateScript = session.SystemAuthenticationControl.Script
                .AllowAnonymousConnections(new List<string>())
                .RemovePrincipal("observer")
                .ToScript();

            await session.SystemAuthenticationControl.UpdateStoreAsync(updateScript, cancellationToken);

            storeScript = await session.SystemAuthenticationControl.GetSystemAuthenticationAsync(cancellationToken);

            WriteLine($"{storeScript}");

            await Task.Delay(5000);

            session.Close();
        }
    }
}
