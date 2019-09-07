export class Utils {
    public static jsonParse<T>(s: string): T | null {
        try {
            return JSON.parse(s);
        } catch {
            return null;
        }
    }
}
