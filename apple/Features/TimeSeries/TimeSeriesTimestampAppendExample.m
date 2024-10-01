//  Diffusion Client Library for iOS, tvOS and OS X / macOS - Examples
//
//  Copyright (C) 2020 - 2023 DiffusionData Ltd.
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

#import "TimeSeriesTimestampAppendExample.h"

@import Diffusion;

@implementation TimeSeriesTimestampAppendExample  {
    PTDiffusionSession* _session;
}

-(void)startWithURL:(NSURL*)url {

    PTDiffusionCredentials *const credentials =
        [[PTDiffusionCredentials alloc] initWithPassword:@"password"];

    PTDiffusionSessionConfiguration *const sessionConfiguration =
        [[PTDiffusionSessionConfiguration alloc] initWithPrincipal:@"control"
                                                       credentials:credentials];

    NSLog(@"Connecting...");

    [PTDiffusionSession openWithURL:url
                      configuration:sessionConfiguration
                  completionHandler:^(PTDiffusionSession *const session, NSError *const error)
     {
         if (!session) {
             NSLog(@"Failed to open session: %@", error);
             return;
         }

         // At this point we now have a connected session.
         NSLog(@"Connected.");

         // Set ivar to maintain a strong reference to the session.
         self->_session = session;

         NSString *const topicPath = @"timeSeries/example";

         // create the topic (Publisher)
         [self createTimeSeriesTopic:topicPath fromSession:session];

         // append value and user supplied timestamp to the topic (Publisher)
         NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
         [dateFormatter setDateFormat:@"yyyy-MM-dd hh:mm:ss Z"];

         // append value to the topic (Publisher)
         NSDate *date1 = [dateFormatter dateFromString:@"1452-04-15 12:34:56 +0000"];
         [self appendValue:@"hello world!" withDate:date1 toTimeSeriesTopic:topicPath usingSession:session];

         NSDate *date2 = [dateFormatter dateFromString:@"1980-01-04 09:00:00 +0000"];
         [self appendValue:@"Diffusion" withDate:date2 toTimeSeriesTopic:topicPath usingSession:session];

         NSDate *date3 = [dateFormatter dateFromString:@"2042-09-17 23:53:46 +0000"];
         [self appendValue:@"DiffusionData" withDate:date3 toTimeSeriesTopic:topicPath usingSession:session];
     }];
}


-(void) createTimeSeriesTopic:(NSString *const)topicPath fromSession:(PTDiffusionSession *const)session {

    NSDictionary *properties =
        @{PTDiffusionTopicSpecification.timeSeriesEventValueTypePropertyKey: PTDiffusionDataTypes.json.typeName};

    PTDiffusionTopicSpecification *const specification =
        [[PTDiffusionTopicSpecification alloc] initWithType:PTDiffusionTopicType_TimeSeries
                                                 properties:properties];

    [session.topicControl addTopicWithPath:topicPath
                             specification:specification
                         completionHandler:^(PTDiffusionAddTopicResult * _Nullable result, NSError * _Nullable error)
     {
         if ([result isEqual:PTDiffusionAddTopicResult.exists]) {
             NSLog(@"Topic already existed");
         }
         else if ([result isEqual:PTDiffusionAddTopicResult.created]) {
             NSLog(@"Topic created");
         }
         else if (error != nil) {
             NSLog(@"An error occurred while attempting to create topic: [%@]", error);
             return;
         }
     }];
}


-(void)       appendValue:(NSString *const)value
                 withDate:(NSDate *)date
        toTimeSeriesTopic:(NSString *const)topicPath
             usingSession:(PTDiffusionSession *const)session {

    NSError *error;
    PTDiffusionJSON *const jsonValue =
        [[PTDiffusionJSON alloc] initWithJSONString:[NSString stringWithFormat:@"{\"value\" : \"%@\"}", value]
                                              error:&error];

    [session.timeSeries appendToTopicPath:topicPath
                                JSONValue:jsonValue
                                timestamp:date
                        completionHandler:^(PTDiffusionTimeSeriesEventMetadata * _Nullable eventMetadata, NSError * _Nullable error)
     {
         if (error != nil) {
             NSLog(@"An error occurred while appending to the topic: [%@]", error);
             return;
         }

         NSString *const author = eventMetadata.author;
         NSDate *const timestamp = [NSDate dateWithTimeIntervalSince1970:eventMetadata.timestamp / 1000];
         NSDateFormatter *const dateFormatter = [[NSDateFormatter alloc] init];
         [dateFormatter setDateFormat:@"yyyy-MM-dd HH:mm:ss"];
         NSLog(@"Time series topic with user supplied timestamp appended by [%@] at [%@]", author, [dateFormatter stringFromDate:timestamp]);
     }];
}


@end
