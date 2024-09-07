export function myExportedFunction(): void {
    console.log('test');
}

function myLocalFunction(): void {
    console.log('efwefw');
}

async function myLocalAsyncFunction(): Promise<void> {
    console.log('efwefw');
}

export class Foo {
    public somePublicFunction(): void {
        console.log('test');
    }

    private async somePrivateFunction(): Promise<void> {
        console.log('test');
    }
}

export interface ISome {
    thing: string;
}
