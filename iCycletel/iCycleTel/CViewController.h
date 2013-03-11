//
//  CViewController.h
//  iCycleTel
//
//  Created by Deepan Subramani on 23/01/13.
//  Copyright (c) 2013 IRH. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface CViewController : UIViewController<UIWebViewDelegate>{
    @private
    UIWebView *webView;
}

@property (nonatomic, strong) IBOutlet UIWebView *webView;

@end
