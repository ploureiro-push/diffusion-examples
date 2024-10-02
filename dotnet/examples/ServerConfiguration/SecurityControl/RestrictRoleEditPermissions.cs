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
using static System.Console;
using static PushTechnology.ClientInterface.Examples.Program;

namespace PushTechnology.ClientInterface.Examples.ServerConfiguration.SecurityControl
{
    public sealed class RestrictRoleEditPermissions : Example
    {
        public override async Task Run(CancellationToken cancellationToken, string[] args)
        {
            string serverUrl = args[0];

            var session = Diffusion.Sessions
                .Principal("admin")
                .Credentials(Diffusion.Credentials.Password("password"))
                .Open(serverUrl);

            WriteLine($"OPERATOR role has been locked by admin principal.");

            string script = session.SecurityControl.Script.SetRoleLockedByPrincipal("OPERATOR", "admin").ToScript();

            WriteLine($"{script}");

            await session.SecurityControl.UpdateStoreAsync(script, cancellationToken);

            await Task.Delay(5000);

            script = session.SystemAuthenticationControl.Script
                                .RemovePrincipal("admin")
                                .AddPrincipal("admin", "password", new List<string>() { "ADMINISTRATOR" })
                                .ToScript();

            await session.SystemAuthenticationControl.UpdateStoreAsync(script, cancellationToken);

            session.Close();
        }
    }
}
