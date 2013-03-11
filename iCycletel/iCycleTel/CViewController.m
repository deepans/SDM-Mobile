//
//  CViewController.m
//  iCycleTel
//
//  Created by Deepan Subramani on 23/01/13.
//  Copyright (c) 2013 IRH. All rights reserved.
//

#import "CViewController.h"

@interface CViewController ()

@end

@implementation CViewController
@synthesize webView;

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    webView.delegate = self;
    NSString *htmlPath = [[NSBundle mainBundle] pathForResource:@"cycletel" ofType:@"html" inDirectory:@"www"];
    [self.webView loadRequest:[NSURLRequest requestWithURL:[NSURL fileURLWithPath:htmlPath]]];
}

- (void)webViewDidFinishLoad:(UIWebView *)webView{
    NSString *render=[[NSString alloc]initWithFormat:@"$.cycletel.public_api.render('%@');", @"tablet"];
    [self.webView stringByEvaluatingJavaScriptFromString:render];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
