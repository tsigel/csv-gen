export const SEPARATORS = {
    cell: ',',
    row: '\n'
};

export interface IHash<T> {
    [key: string]: T;
}

export interface IGenerateData {
    header: Array<{ id: string; name: string }>;
    body: Array<object>;
    processors?: IHash<(data: any) => string>;
}

export function generate(data: IGenerateData): string {
    let csv = '';

    data.header.forEach((head) => {
        csv += escape(head.name) + SEPARATORS.cell;
    });

    data.processors = data.processors || Object.create(null);
    csv += SEPARATORS.row;

    data.body.forEach((bodyItemHash) => {
        data.header.forEach((head) => {
            if (bodyItemHash[head.id]) {
                if (data.processors[head.id]) {
                    csv += escape(data.processors[head.id](bodyItemHash[head.id]));
                } else {
                    csv += escape(bodyItemHash[head.id]);
                }
            }
            csv += SEPARATORS.cell;
        });
        csv += SEPARATORS.row;
    });

    return csv;
}

export function download(csv: string, name: string, attrs: IHash<string> = Object.create(null)): void {
    const content = encodeURI(`data:text/csv;charset=utf-8,${csv}`);
    const link = document.createElement('a');
    link.setAttribute('href', content);
    link.setAttribute('download', name);
    Object.keys(attrs).forEach((name) => {
        const value = attrs[name];
        link.setAttribute(name, value);
    });
    link.click();
}

function escape(text: any) {
    return `"${String(text).replace(/"/g, '""')}"`;
}
