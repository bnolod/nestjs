import { Controller, Get, Param, Query, Render, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';
import {quotes} from './quotes';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello() {
    return {
      message: this.appService.getHello()
    };
  }

  @Get('/quotes')
  @Render('quotes')
  getQuotes() {
    return  {
      data: quotes
    }
}
  @Get('/randomQuote')
  @Render('randomQuote')
  getRandomQuote() {
    const randomQuote = quotes.quotes[Math.floor(Math.random() * quotes.quotes.length)];
    return {
      data: randomQuote
    }
  }

  @Get('/topAuthors')
  @Render('topAuthors')
  getTopAuthors() {
   
    const authors = quotes.quotes.reduce((acc, quote) => {
      if (acc[quote.author]) {
        acc[quote.author]++
      } else {
        acc[quote.author] = 1
      }
      return acc
    }, {})
    const sortable = [];

    for (let author in authors) {
      sortable.push([author, authors[author]]);
    }
    sortable.sort(function(a, b) {
      return b[1] - a[1] ;
  });
    return {
      data: sortable
    }
  }

  @Get('search')
  @Render('search')
  GetQuote(@Query('text') text: string) {
      if (quotes.quotes.filter(quote => quote.quote.includes(text)).length > 0)
        return {
          data: quotes.quotes.filter(quote => quote.quote.includes(text))
      }
      else {
        return {
          data: "No quotes found"
        }
      }
    }

    @Get('highlight/:id')
    @Render('highlight')
    getHighlight(@Param('id') id: number, @Query('text') text: string)
    {
      const data = quotes.quotes.filter(quote => quote.id == id)
      var quote = data[0].quote
      var index = quote.indexOf(text);

      if (index >= 0) {
        quote = quote.substring(0, index) + "<span>" + text + "</span>" + quote.substring(index + text.length);
      }
  
      return {
        quote
      }
    }
}
