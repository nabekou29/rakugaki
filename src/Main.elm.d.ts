export namespace Elm {
    namespace Main {
        interface App {
            ports: Ports;
        }

        function init(args: Args): App;
    }
}