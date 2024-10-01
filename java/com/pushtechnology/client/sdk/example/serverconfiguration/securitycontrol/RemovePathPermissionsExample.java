/*******************************************************************************
 * Copyright (C) 2023 - 2024 DiffusionData Ltd.
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
package com.pushtechnology.client.sdk.example.serverconfiguration.securitycontrol;

import com.pushtechnology.diffusion.client.Diffusion;
import com.pushtechnology.diffusion.client.features.control.clients.SecurityControl;
import com.pushtechnology.diffusion.client.features.control.clients.SecurityControl.ScriptBuilder;
import com.pushtechnology.diffusion.client.session.Session;
import com.pushtechnology.diffusion.client.types.PathPermission;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashSet;
import java.util.Set;

public class RemovePathPermissionsExample {

    private static final Logger LOG = LoggerFactory.getLogger(
        RemovePathPermissionsExample.class);

    public static void main(String[] args) throws Exception {
        Session session = Diffusion.sessions()
            .principal("admin")
            .password("password")
            .open("ws://localhost:8080");

        SecurityControl securityControl = session.feature(SecurityControl.class);
        ScriptBuilder builder = securityControl.scriptBuilder();

        Set<PathPermission> myPermissions = new HashSet<PathPermission>(){{
            add(PathPermission.UPDATE_TOPIC);
            add(PathPermission.MODIFY_TOPIC);
            add(PathPermission.READ_TOPIC);
            add(PathPermission.SELECT_TOPIC);
        }};

        System.out.println("Allowing Role CLIENT to update and modify my/topic/path");

        builder.setPathPermissions("CLIENT", "my/topic/path", myPermissions);
        String script = builder.script();
        System.out.println(script);

        securityControl.updateStore(script).join();

        System.out.println("Removing path permissions for Role CLIENT at my/topic/path");

        SecurityControl.ScriptBuilder newBuilder = securityControl.scriptBuilder();
        newBuilder.removePathPermissions("CLIENT", "my/topic/path");
        String newScript = newBuilder.script();
        System.out.println(newScript);

        securityControl.updateStore(newScript).join();

        session.close();

        LOG.info(newScript);
    }
}
