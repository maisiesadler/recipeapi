import { Fs } from '../Fs';

export class TemplateReplacer {
    public static async Replace(template: string): Promise<string> {
        let next = TemplateReplacer.findNext(template);
        while (next !== null) {
            const file = next[1]
            const t = await Fs.readFile(`templates/${file}.html`);
            template = template.replace(next[0], t);
            next = TemplateReplacer.findNext(template);
        }

        return template;
    }

    private static findNext(o: string): RegExpExecArray {
        return /\[\[ *(\w+) *\]\]/g.exec(o);
    }
}