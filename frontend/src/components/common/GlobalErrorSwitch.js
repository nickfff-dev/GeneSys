class GlobalErrorSwitch extends Component {
    previousLocation = this.props.location;

    componentWillUpdate(nextProps) {
        const { location } = this.props;

        if (nextProps.history.action !== "POP" && (!location.state || !location.state.error)) {
            this.previousLocation = this.props.location;
        }
    }

    render() {
        const { location } = this.props;
        const isError = !!(
            (location.state && location.state.error && this.previousLocation !== location) // not initial render
        );

        return (
            <div>
                {isError ? (
                    <Route component={Error} />
                ) : (
                    <Switch location={isError ? this.previousLocation : location}>
                        <Route path="/admin" component={Backend} />
                        <Route path="/" component={Frontend} />
                    </Switch>
                )}
            </div>
        );
    }
}
