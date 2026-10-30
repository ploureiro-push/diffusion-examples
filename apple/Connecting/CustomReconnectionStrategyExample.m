//  Diffusion Client Library for iOS and OS X / macOS - Examples
//
//  Copyright (C) 2016 - 2026 DiffusionData Ltd.
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//  http://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.

#import "CustomReconnectionStrategyExample.h"

@import Diffusion;

@implementation CustomReconnectionStrategyExample {
    PTDiffusionSession* _session;
}

-(void)startWithURL:(NSURL*)url {
    NSLog(@"Connecting...");

    PTDiffusionMutableSessionConfiguration *const sessionConfiguration =
        [PTDiffusionMutableSessionConfiguration new];

    // Reconnect up to 10 times, using the built-in exponential backoff to
    // double the interval between attempts from 100 milliseconds, up to a
    // maximum of 60 seconds.
    PTDiffusionRetryPolicy *const retryPolicy =
        [[PTDiffusionRetryPolicy alloc] initWithInterval:100
                                                attempts:10
                                              multiplier:2
                                         maximumInterval:60000];

    // Set the maximum amount of time we'll try and reconnect for to 10 minutes.
    // If no timeout is specified, using initWithRetryPolicy:, it is calculated
    // from the retry policy.
    sessionConfiguration.reconnectionPolicy =
        [[PTDiffusionReconnectionPolicy alloc] initWithRetryPolicy:retryPolicy
                                                           timeout:10.0 * 60.0 // seconds
                                                recoveryBufferSize:[PTDiffusionSessionConfiguration defaultRecoveryBufferSize]];

    // Start connecting asynchronously.
    [PTDiffusionSession openWithURL:url
                      configuration:sessionConfiguration
                  completionHandler:^(PTDiffusionSession *session, NSError *error)
    {
        if (!session) {
            NSLog(@"Failed to open session: %@", error);
            return;
        }

        // At this point we now have a connected session.
        NSLog(@"Connected.");

        // Set ivar to maintain a strong reference to the session.
        self->_session = session;
    }];
}

@end
