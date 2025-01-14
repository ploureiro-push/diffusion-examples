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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashSet;
import java.util.Set;

public class DefineRolesHierarchyExample {

    private static final Logger LOG = LoggerFactory.getLogger(
        DefineRolesHierarchyExample.class);

    public static void main(String[] args) throws Exception {

        Session session = Diffusion.sessions()
            .principal("admin")
            .password("password")
            .open("ws://localhost:8080");

        SecurityControl securityControl = session.feature(SecurityControl.class);
        ScriptBuilder builder = securityControl.scriptBuilder();

        Set<String> myRoles = new HashSet<String>(){{
            add("CLIENT");
            add("CLIENT_CONTROL");
        }};

        builder.setRoleIncludes("OPERATOR", myRoles);

        securityControl.updateStore(builder.script()).whenComplete((r, ex) ->
            LOG.info("OPERATOR now includes CLIENT and CLIENT_CONTROL roles"));

        session.close();
    }
}
