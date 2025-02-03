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
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using static System.Console;
using PushTechnology.ClientInterface.Client.Factories;
using PushTechnology.ClientInterface.Client.Types;
using static PushTechnology.ClientInterface.Examples.Program;

namespace PushTechnology.ClientInterface.Examples.ServerConfiguration.SecurityControl
{
    public sealed class SetDefaultPathPermissions : Example
    {
        public override async Task Run(CancellationToken cancellationToken, string[] args)
        {
            string serverUrl = args[0];

            var session = Diffusion.Sessions
                .Principal("admin")
                .Credentials(Diffusion.Credentials.Password("password"))
                .Open(serverUrl);

            var defaultPathPermissions = new List<PathPermission>();

            var securityConfig = await session.SecurityControl.GetSecurityAsync(cancellationToken);

            var clientRole = securityConfig.Roles.Where(x => x.Name == "CLIENT").FirstOrDefault();
            defaultPathPermissions = clientRole.DefaultPathPermissions.ToList();

            WriteLine($"Adding the following permissions to the default path permisions of Role CLIENT: MODIFY_TOPIC and UPDATE_TOPIC.");

            var permissions = new List<PathPermission> { PathPermission.UPDATE_TOPIC, PathPermission.MODIFY_TOPIC };
            permissions.AddRange(defaultPathPermissions);

            string script = session.SecurityControl.Script.SetDefaultPathPermissions("CLIENT", permissions).ToScript();

            WriteLine($"{script}");

            await session.SecurityControl.UpdateStoreAsync(script, cancellationToken);

            session.Close();
        }
    }
}
