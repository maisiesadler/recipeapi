export class TemplateParser {
    public static Parse(o: string, replacer: { [key: string]: any }) {
        let f = TemplateParser.findFors(o);
        while (f !== null) {
            const replacement = TemplateParser.ReplaceFor(f, replacer);
            o = o.replace(f[0], replacement);
            f = TemplateParser.findFors(o);
        }

        let next = TemplateParser.findNext(o);
        while (next !== null) {
            let val = replacer[next[1]] || '';
            if (typeof val.join === 'function') {
                val = val.join('<br>')
            }
            o = o.replace(next[0], val);
            next = TemplateParser.findNext(o);
        }

        return o;
    }

    private static ReplaceFor(match: RegExpExecArray, replacer: { [key: string]: any }): string {
        const name = /each="(.*)"/.exec(match[1])

        const replaceobj = replacer[name[1]]
        if (!Array.isArray(replaceobj)) {
            return '';
        }

        return replaceobj.map(r => {
            return TemplateParser.replaceOne(match[2], r)
        }).join('')
    }

    private static replaceOne(template: string, o: any): string {
        let next = TemplateParser.findNext(template);
        while (next !== null) {
            let val = o[next[1]] || '';
            template = template.replace(next[0], val);
            next = TemplateParser.findNext(template);
        }

        return template;
    }

    private static findNext(o: string): RegExpExecArray {
        return /{{ *(\w+) *}}/g.exec(o);
    }

    private static findFors(o: string): RegExpExecArray {
        return /<for([^>]*)>(.*)<\/for>/s.exec(o);
    }
}