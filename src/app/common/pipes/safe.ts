import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

/**
 * Pipe for trust content as html
 */
@Pipe({ name: 'safeHtml' })
export class SafeHTML implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }

  transform(style) {
    return this.sanitizer.bypassSecurityTrustHtml(style);
  }
}

/**
 * Pipe for trust url as a valid url
 */
@Pipe({ name: 'safeUrl' })
export class SafeURL implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }

  transform(url) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
}

/**
 * Pipe for trust resource(script, style) url as a valid url
 */
@Pipe({ name: 'safeResourceUrl' })
export class SafeResourceURL implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }

  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
