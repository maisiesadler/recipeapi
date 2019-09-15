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
            let val = replacer[next[1].trim()] || '';
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

        return replaceobj.map((replaceContents, _idx) => {
            // using {...} syntax with the mongo objects gives weird results
            replaceContents._idx = _idx
            return TemplateParser.replaceOne(match[2], replaceContents)
        }).join('')
    }

    private static replaceOne(template: string, o: any): string {
        let next = TemplateParser.findNext(template);
        while (next !== null) {
            if (next[0].indexOf('=') > 0) {
                // is expression
                const parts = next[1].split(/[= ]/).filter(x => !!x);
                let s = next[1]
                parts.forEach(part => {
                    if (/^[A-Za-z_]+$/.exec(part) !== null) {
                        // todo: this won't work if the variable == string name
                        let val = o[part];
                        if (typeof val == 'string') {
                            val = `'${val}'`;
                        }
                        s = s.replace(part, val);
                    }
                })
                let evaled = 'not evaled';
                try {
                    evaled = eval(s)
                } catch (e) {
                    evaled = 'error: ' + e
                }
                template = template.replace(next[0], evaled);
            } else {
                let val = o[next[1]] || '';
                template = template.replace(next[0], val);
            }
            next = TemplateParser.findNext(template);
        }

        return template;
    }

    private static findNext(o: string): RegExpExecArray {
        return /{{ *([\w='_?: ]+) *}}/g.exec(o);
    }

    private static findFors(o: string): RegExpExecArray {
        return /<for([^>]*)>(.*?)<\/for>/s.exec(o);
    }
}