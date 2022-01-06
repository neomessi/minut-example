import React, {useState} from "react";

// export default () => { // will not work for #3??
export default function() { // have to do this for #3??

    // #1
    const [viewDisclaimer, setViewDisclaimer] = useState(false);

    // #2
    const handleSetViewDisclaimerImplicit = (e) => { // e: React.ChangeEvent<HTMLInputElement> | React.SyntheticEvent<HTMLInputElement>
        setViewDisclaimer(e.target.checked);
    }

    // #3
    function handleSetViewDisclaimerBound() {
        // NOTE:
        // Uncaught TypeError: Cannot read property 'target' of undefined
        console.log(this);
        setViewDisclaimer(this.target.checked);
    }

    return (
        <>
            <label>Click here to see
                <input type="checkbox"
                    // #1 (explicitly pass event to setter) onChange={ (e) => { setViewDisclaimer(e.target.checked) } }
                    // #2 (event implicitly passed to handler) onChange={handleSetViewDisclaimerImplicit}
                    // #3
                    // onChange={handleSetViewDisclaimerBound.bind(this)}
                    onChange={ function() { console.log(this) }}
                />
            </label>
            { viewDisclaimer &&
                <p>No guarantees</p>
            }
        </>
    );
}