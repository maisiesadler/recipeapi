export class TemplateParser {
    public static Parse(o: string, replacer: { [key: string]: string | string[] }) {
        let next = TemplateParser.findNext(o);
        while (next !== null) {
            let val = replacer[next[1]] || '';
            if (typeof val === 'string') {
                val = [val]
            }
            o = o.replace(next[0], val.join('<br>'));
            next = TemplateParser.findNext(o);
        }

        return o;
    }

    private static findNext(o: string): RegExpExecArray {
        return /{{ *(\w+) *}}/g.exec(o);
    }
}