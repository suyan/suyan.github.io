---
layout: post                                   
title: object-c learning      	   
category: language                                 
tags: [mac vpn]
keywords: 笔记
description:  
---

### *string*

NSString objects are usually created in one of three ways:

1. Using string literals like @"this example"

        NSString* originalString = @"Text of the string";
        
        NSString* uppercaseString = [originalString uppercaseString];


2. Loading strings from other data, like files

        

3. Generating strings from existing strings

#### substrw

    NSString* startSubstring = [originalString substringToIndex:5]; // "This "
    
    NSString* endSubstring = [originalString substringFromIndex:5]; // "is An EXAMPLE"
    
    // make a range
    NSRange theRange = NSMakeRange(2,5); // note： NSRange is not an Objective-C class, but rather a plain old C structure.
    
    NSString* substring = [originalString substringWithRange:theRange]; // "is is" 


#### compare two string

    if ([firstString isEqualToString:secondString]) { 
        // Do something
    }

    // note: isEqualToString is case-sensitive

#### search string

    SString* sourceString = @"Four score and seven years ago";
    NSRange range = [sourceString rangeOfString:@"SEVEN"
                         options:NSCaseInsensitiveSearch];


### *Arrays*

> An array is simply a list of objects. Arrays store a collection of objects in order, and allow you to refer to a specific item in the collection or all of them at once.
    

    // create
    NSArray* myArray = @[@"one", @"two", @"three"];

#### find exsit

    NSArray* myArray = @[@"one", @"two", @"three"];
    int index = [myArray indexOfObject:@"two"]; // should be equal to 1

    if (index == NSNotFound) {
        NSLog(@"Couldn't find the object!");
    }

#### Fast Enumeration （foreach）

    NSArray* myArray = @[@"one", @"two", @"three"];
    for (NSString* string in myArray) {
        // this code is repeated 3 times, one for each item in the array
    }

    

#### Mutable Arrays

    NSMutableArray* myArray = [NSMutableArray arrayWithArray:@[@"One", @"Two"]]; 

    // Add "Three" to the end
    [myArray addObject:@"Three"];
    // Add "Zero" to the start
    [myArray insertObject:@"Zero" atIndex:0];
    // The array now contains "Zero", "One", "Two", "Three".
    [myArray removeObject:@"One"]; // removes "One"
    [myArray removeObjectAtIndex:1]; // removes "Three", the second
                                     // item in the array at this point
    // The array now contains just "Two"
    
    // replace
    [myArray replaceObjectAtIndex:1 withObject:@"Bananas"];
    myArray[0] = @"Null";
    
### *Dictionaries*

    NSDictionary* translationDictionary = @{
        @"greeting": @"Hello",
        @"farewell": @"Goodbye"
    };

    NSDictionary* translationDictionary = @{@"greeting": @"Hello"};
    NSString* greeting = translationDictionary[@"greeting"];

    // foreach

    // Here, aDictionary is an NSDictionary
    for (NSString* key in aDictionary) { 
        NSObject* theValue = aDictionary[key];
    }

#### mutable dictionary NSMutableDictionary

    NSMutableDictionary* aDictionary = @{};
    aDictionary[@"greeting"] = @"Hello";
    aDictionary[@"farewell"] = @"Goodbye";

### *NSValue and NSNumber*

    NSNumber* theNumber = @123;
    int myValue = [theNumber intValue];
    // 'numbers' is an NSMutableArray
    [numbers addObject:theNumber];

    int a=100;
    NSNumber* number = @(a+1);
   
### *Data*

#### Loading Data from Files and URLs

    // Assuming that there is a text file at /Examples/Test.txt:
    NSString* filePath = @"/Examples/Test.txt";
    NSData* loadedData = [NSData dataWithContentsOfFile:filePath];

    
#### write

    // Here, loadedData is an NSData object
    NSString* filePath = @"/Examples/Test.txt";
    [loadedData writeToFile:filePath atomically:YES];
    
### *Serialization and Deserialization*


